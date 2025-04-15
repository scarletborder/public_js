var startIndex = 1;
  var maxResults = 32;
  var allResults = [];
  var allYears = {}; // Store the count of articles by year
  var allMonths = {}; // Store the count of articles by month for each year

  // 初始化缓存数据库
  function initCache() {
      return new Promise((resolve, reject) => {
          const request = indexedDB.open("BlogArchiveCache", 1);
          
          request.onerror = function(event) {
              console.error("IndexedDB 错误:", event.target.error);
              reject(event.target.error);
          };
          
          request.onupgradeneeded = function(event) {
              const db = event.target.result;
              
              // 创建存储对象
              if (!db.objectStoreNames.contains("posts")) {
                  db.createObjectStore("posts", { keyPath: "id" });
              }
              
              if (!db.objectStoreNames.contains("metadata")) {
                  db.createObjectStore("metadata", { keyPath: "key" });
              }
          };
          
          request.onsuccess = function(event) {
              resolve(event.target.result);
          };
      });
  }

  // 检查缓存是否有效（是否过期）
  async function isCacheValid() {
      try {
          const db = await initCache();
          return new Promise((resolve) => {
              const transaction = db.transaction("metadata", "readonly");
              const metadataStore = transaction.objectStore("metadata");
              const request = metadataStore.get("lastUpdate");
              
              request.onsuccess = function() {
                  if (request.result) {
                      const lastUpdate = new Date(request.result.value);
                      const now = new Date();
                      const dayInMs = 24 * 60 * 60 * 1000; // 一天的毫秒数
                      
                      // 检查缓存是否在1天内
                      resolve((now - lastUpdate) < dayInMs);
                  } else {
                      resolve(false);
                  }
              };
              
              request.onerror = function() {
                  resolve(false);
              };
          });
      } catch (error) {
          console.error("检查缓存有效性出错:", error);
          return false;
      }
  }

  // 从缓存中加载数据
  async function loadFromCache() {
      try {
          const db = await initCache();
          return new Promise((resolve) => {
              const transaction = db.transaction(["posts", "metadata"], "readonly");
              const postsStore = transaction.objectStore("posts");
              const metadataStore = transaction.objectStore("metadata");
              
              // 获取所有文章
              const postsRequest = postsStore.getAll();
              
              postsRequest.onsuccess = function() {
                  if (postsRequest.result && postsRequest.result.length > 0) {
                      // 获取年份和月份数据
                      const yearsRequest = metadataStore.get("allYears");
                      const monthsRequest = metadataStore.get("allMonths");
                      
                      yearsRequest.onsuccess = function() {
                          monthsRequest.onsuccess = function() {
                              // 重建数据
                              allResults = reconstructResults(postsRequest.result);
                              allYears = yearsRequest.result ? yearsRequest.result.value : {};
                              allMonths = monthsRequest.result ? monthsRequest.result.value : {};
                              
                              resolve(true);
                          };
                      };
                  } else {
                      resolve(false);
                  }
              };
              
              postsRequest.onerror = function() {
                  resolve(false);
              };
          });
      } catch (error) {
          console.error("从缓存加载数据出错:", error);
          return false;
      }
  }

  // 重建文章列表元素
  function reconstructResults(postsData) {
      return postsData.map(post => {
          const liE = document.createElement("li");
          const a1E = document.createElement("a");
          a1E.href = post.url;
          a1E.textContent = post.title;
          liE.appendChild(a1E);
          
          // 设置数据属性
          liE.dataset.year = post.year;
          liE.dataset.month = post.month;
          
          return liE;
      });
  }

  // 保存数据到缓存
  async function saveToCache() {
      try {
          const db = await initCache();
          const transaction = db.transaction(["posts", "metadata"], "readwrite");
          const postsStore = transaction.objectStore("posts");
          const metadataStore = transaction.objectStore("metadata");
          
          // 清除旧数据
          postsStore.clear();
          
          // 将文章数据保存为可序列化对象
          allResults.forEach((item, index) => {
              postsStore.add({
                  id: index,
                  title: item.children[0].textContent,
                  url: item.children[0].href,
                  year: item.dataset.year,
                  month: item.dataset.month
              });
          });
          
          // 保存年份和月份数据
          metadataStore.put({ key: "allYears", value: allYears });
          metadataStore.put({ key: "allMonths", value: allMonths });
          
          // 更新缓存时间戳
          metadataStore.put({ key: "lastUpdate", value: new Date().toISOString() });
          
          return new Promise((resolve) => {
              transaction.oncomplete = function() {
                  console.log("数据已缓存");
                  resolve(true);
              };
              
              transaction.onerror = function() {
                  resolve(false);
              };
          });
      } catch (error) {
          console.error("保存数据到缓存出错:", error);
          return false;
      }
  }

  // 检查缓存并加载数据
  async function checkCacheAndLoad() {
      // 首先检查缓存是否有效
      const cacheValid = await isCacheValid();
      
      if (cacheValid) {
          // 如果缓存有效，尝试从缓存加载
          const loaded = await loadFromCache();
          if (loaded) {
              console.log("从缓存加载数据成功");
              // 更新UI
              updateYearAndMonthSelect();
              filterAndPrintResults();
              return true;
          }
      }
      
      console.log("从服务器获取数据");
      return false;
  }

  // 原始函数
  function sendQuery12() {
      var scpt = document.createElement("script");
      scpt.src = "http://blog.scarletborder.cn/feeds/posts/summary?alt=json&callback=processPostList12&start-index=" + startIndex + "&max-results=" + maxResults;
      document.body.appendChild(scpt);
  }

  function processPostList12(root) {
      var elmt = document.getElementById("postList12");
      if (!elmt)
          return;

      var feed = root.feed;

      if (feed.entry && feed.entry.length > 0) {
          for (var i = 0; i < feed.entry.length; i++) {
              var entry = feed.entry[i];
              var title = entry.title.$t;
              var date = entry.published.$t;

              var year = date.substr(0, 4);
              var month = date.substr(5, 2);

              // Add the article to the allResults array
              for (var j = 0; j < entry.link.length; j++) {
                  if (entry.link[j].rel == "alternate") {
                      var url = entry.link[j].href;
                      if (url && url.length > 0 && title && title.length > 0) {
                          var liE = document.createElement("li");
                          var a1E = document.createElement("a");
                          a1E.href = url;
                          a1E.textContent = title + " (" + date.substr(0, 10) + ")";
                          liE.appendChild(a1E);

                          // Store the article with its year and month
                          liE.dataset.year = year;
                          liE.dataset.month = month;

                          allResults.push(liE);

                          // Update the count for the specific year and month
                          if (!allYears[year]) {
                              allYears[year] = 0;
                          }
                          allYears[year]++;

                          if (!allMonths[year]) {
                              allMonths[year] = {};
                          }
                          if (!allMonths[year][month]) {
                              allMonths[year][month] = 0;
                          }
                          allMonths[year][month]++;
                      }
                      break;
                  }
              }
          }

          // Update year and month select options
          updateYearAndMonthSelect();

          if (feed.entry.length >= maxResults) {
              startIndex += maxResults;
              sendQuery12();
          } else {
              filterAndPrintResults();
              // 所有数据加载完成，保存到缓存
              saveToCache();
          }
      } else {
          filterAndPrintResults();
          // 没有更多数据，保存到缓存
          saveToCache();
      }
  }

  // 修改初始加载逻辑，先检查缓存
  async function loadData() {
      const usedCache = await checkCacheAndLoad();
      
      // 如果没有使用缓存，从服务器获取数据
      if (!usedCache) {
          // 重置数据
          startIndex = 1;
          allResults = [];
          allYears = {};
          allMonths = {};
          
          // 从服务器获取数据
          sendQuery12();
      }
  }

  // 原有函数保持不变
  function updateYearAndMonthSelect(preserveYearSelection) {
      var yearSelect = document.getElementById("yearSelect");
      var monthSelect = document.getElementById("monthSelect");

      // 保存当前选中的年份
      var currentSelectedYear = preserveYearSelection ? yearSelect.value : null;

      // 清空年份选项
      yearSelect.innerHTML = '';

      // 添加年份选项
      Object.keys(allYears).sort(function (a, b) {
          return b - a; // 从大到小排序年份
      }).forEach(function (year) {
          var option = document.createElement("option");
          option.value = year;
          option.textContent = year + " (" + allYears[year] + ")";
          yearSelect.appendChild(option);

          // 如果是之前选中的年份，设置为选中状态
          if (currentSelectedYear === year) {
              option.selected = true;
          }
      });

      // 获取当前选中的年份
      var selectedYear = yearSelect.value;

      // 更新月份选项
      monthSelect.innerHTML = '<option value="all">所有月份</option>';

      if (selectedYear && allMonths[selectedYear]) {
          Object.keys(allMonths[selectedYear]).sort(function (a, b) {
              return a - b;
          }).forEach(function (month) {
              if (allMonths[selectedYear][month] > 0) {
                  var option = document.createElement("option");
                  option.value = month;
                  option.textContent = month + "月 (" + allMonths[selectedYear][month] + ")";
                  monthSelect.appendChild(option);
              }
          });
      }
  }

  function filterAndPrintResults() {
      var selectedYear = document.getElementById("yearSelect").value;
      var selectedMonth = document.getElementById("monthSelect").value;

      var filteredResults = allResults.filter(function (item) {
          var yearMatch = (selectedYear === "" || item.dataset.year === selectedYear);
          var monthMatch = (selectedMonth === "all" || item.dataset.month === selectedMonth);
          return yearMatch && monthMatch;
      });

      var elmt = document.getElementById("postList12");
      elmt.innerHTML = '';  // Clear previous results
      filteredResults.forEach(function (item) {
          elmt.appendChild(item);
      });
  }

  // 初始调用修改为使用新函数
  loadData();

  // Event listeners for filtering
  document.getElementById("yearSelect").addEventListener("change", function () {
      // 更新月份选项，但保留年份选择
      updateYearAndMonthSelect(true);
      filterAndPrintResults();
  });

  document.getElementById("monthSelect").addEventListener("change", filterAndPrintResults);
