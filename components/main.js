import { ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'


export default {
  setup() {
    return {
    }
  },


  // 設定全域變數
  data() {
    return {
      testObj:
        { count: 0 },

      bottomVisible: null,
      loadCardsNum: 20,

      tabSelected: 'comic',
      isLoading: true,
      searchText: '',
      searchBy: 'tittle',

      rawData: {
        comicListArr: [],
        commentsListArr: [],
        tagsListArr: []
      },

      comicMainPageObj: {
        sortBy: 'time',
        sortReverse: true,
        selected: 0,
        selectedID: 0,
        comicModal: null,
        comicModalCollapse: null,
        comicModalCollapsePw: null
      },

      // 用於新增評論的表單相關
      commentFormObj: {
        commentMethodType: 'addComment',
        selectedCommentId: 0,
        userName: '',
        stars: 0,
        userComment: '',
        pw: '',
        warning: '',
        tagInputText: '',
        tagsShowMore: false
      },

      // 用於新增漫畫的表單相關
      addComicObj: {
        selected: 0,
        comicModal: null,
        searchComicList: [],
        loadPage: 1,
        searchError: false
      },

      updateInfoObj: {
        tempComicInfo: {
          status: undefined,
          lastUpdateDate: undefined,
          picUrl: undefined,
        },
        searchError: undefined,
      }

    }
  },


  methods: {
    getUpdateInfo() {
      this.isLoading = true;
      fetch('https://script.google.com/macros/s/AKfycbyah_tN71FA1HwPvt73i_lHERio1adXwFP_X52VFR9qZPAJLKhIldHM3U7MIvRzo1t68g/exec?type=getComicInfo&comicId=' + this.comicMainPageObj.selectedID,
        {
          signal: AbortSignal.timeout(5000)
        }
      )
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);

          console.log('UpdateInfo geted');
          this.updateInfoObj.tempComicInfo = JSON.parse(db);
          this.updateInfoObj.searchError = undefined;
          this.isLoading = false;
        })
        .catch((error) => {
          if (error.name === "TimeoutError") {
            console.error("Timeout: It took more than 5 seconds to get the result!");
            this.updateInfoObj.searchError = '搜尋超時，可能是伺服器障礙，請重試。'
            this.isLoading = false;
          }
          else {
            console.log(error);
            this.updateInfoObj.searchError = '異常：' + error
            this.isLoading = false;
          }
        })
    },

    updateInfo() {
      this.isLoading = true;
      var postBody = {
        type: 'setComicState',
        comic: JSON.stringify(this.updateInfoObj.tempComicInfo),
        comicId: this.comicMainPageObj.selectedID
      }

      fetch('https://script.google.com/macros/s/AKfycbyah_tN71FA1HwPvt73i_lHERio1adXwFP_X52VFR9qZPAJLKhIldHM3U7MIvRzo1t68g/exec',
        {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify(postBody),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        })
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);
          console.log(db);
          console.log('info updated');
          this.raloadComicList();
          this.isLoading = false;
          this.addComicObj.searchError = false;
          this.updateInfoObj.tempComicInfo = {
            status: undefined,
            lastUpdateDate: undefined,
            picUrl: undefined,
          };
        })
        .catch((error) => {
          if (error.name === "TimeoutError") {
            console.error("Timeout: It took more than 5 seconds to get the result!");
            this.addComicObj.searchError = '搜尋超時，可能是伺服器障礙，請重試。'
            this.isLoading = false;
          }
          else {
            console.log(error);
            this.addComicObj.searchError = '異常：' + error
            this.isLoading = false;
          }
        })


    },
    raloadComicList() {
      this.isLoading = true;
      fetch('https://script.google.com/macros/s/AKfycbzshA7Vgj-ff3dIeizZQhuX7yvNndNCemG1cFTxPWJlliSlA55_/exec?type=comicList')
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);

          console.log('Comic List geted');
          this.rawData.comicListArr = JSON.parse(db);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        })
    },
    raloadCommentList() {
      this.isLoading = true;
      fetch('https://script.google.com/macros/s/AKfycbzshA7Vgj-ff3dIeizZQhuX7yvNndNCemG1cFTxPWJlliSlA55_/exec?type=commentList')
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);

          console.log('Comment List geted');
          this.rawData.commentsListArr = JSON.parse(db);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        })
    },
    raloadTagList() {
      this.isLoading = true;
      fetch('https://script.google.com/macros/s/AKfycbzshA7Vgj-ff3dIeizZQhuX7yvNndNCemG1cFTxPWJlliSlA55_/exec?type=searchTags')
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);

          console.log('Tag List geted');
          this.rawData.tagsListArr = JSON.parse(db);
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        })
    },
    //取得主漫畫列表被點擊的方法
    comicClicked(value) {
      switch (value.type) {
        case 'comic':
          this.comicMainPageObj.selectedID = value.data;
          this.comicMainPageObj.comicModal.show();
          $('#commentTags').importTags(this.comicMainPageList[this.selectedComicIndex][4]);

          break;

        case 'tag':
          this.searchText = value.data;
          this.searchBy = 'tag';
          break;

        case 'user':
          this.searchText = value.data;
          this.searchBy = 'user';
          break;

        default:
          break;
      }    // alert(JSON.stringify(value))
    },

    //取得搜尋結果被點擊的方法
    searchComicClicked(value) {
      switch (value.type) {
        case 'comic':
          this.commentFormObj.commentMethodType = 'addComic';
          this.addComicObj.selected = value.data;
          this.addComicObj.loadPage = 1;
          this.addComicObj.comicModal.show();
          // $('#commentTags').importTags(this.comicMainPageList[this.comicMainPageObj.selected][4]);
          break;

        case 'already':
          this.tabSelected = 'comic';
          this.searchBy = 'tittle',
            this.searchText = '';
          this.comicMainPageObj.selectedID = value.data;
          this.comicMainPageObj.comicModal.show();
          $('#commentTags').importTags(this.comicMainPageList[this.selectedComicIndex][4]);
          break;
        // case 'loadMore':
        // this.commentFormObj.commentMethodType = 'addComic';
        //   this.addComicObj.selected = value.data;
        //   this.addComicObj.loadPage++;

      }
    },

    //取得評論被點擊的方法
    commentClicked(value) {
      switch (value.type) {
        case 'change':
          // console.log('selected: ' + value.data);
          $('#commentTags').importTags(this.comicMainPageList[this.selectedComicIndex][4]);
          this.commentFormObj.commentMethodType = 'changeComment';
          this.commentFormObj.selectedCommentId = value.data;
          this.comicMainPageObj.comicModalCollapse.show();
          this.comicMainPageObj.comicModalCollapsePw.show();
          var commentArr = this.rawData.commentsListArr.slice(0);
          commentArr.forEach(element => {
            if (element[0] == value.data) {
              this.commentFormObj.userName = element[3];
              this.commentFormObj.stars = element[2];
              this.commentFormObj.userComment = element[4];
              return;
            }
          });

          break;

        case 'delete':
          this.commentFormObj.commentMethodType = 'delete';
          this.commentFormObj.selectedCommentId = value.data;
          this.comicMainPageObj.comicModalCollapsePw.show();
          this.comicMainPageObj.comicModalCollapse.hide();

          break;

        default:
          break;
      }    // alert(JSON.stringify(value))
    },

    //取得tag被點擊的方法
    addTagClicked(tagsInput, domId) {
      $(domId).addTag(tagsInput);
    },

    //取得搜尋按鈕被點擊的方法
    searchBtnClicked(type = 'first') {
      if (this.tabSelected != 'addComic') return;
      if (type === 'loadMore') {
        this.addComicObj.loadPage++;
      }

      this.isLoading = true;
      var postBody = {
        type: 'searchComic',
        searchComic: this.searchText,
        loadPage: this.addComicObj.loadPage
      }
      var payload = Object.keys(postBody).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(postBody[k])
      }).join('&');
      fetch('https://script.google.com/macros/s/AKfycbzshA7Vgj-ff3dIeizZQhuX7yvNndNCemG1cFTxPWJlliSlA55_/exec?' + payload,
        {
          signal: AbortSignal.timeout(5000)
        })
        .then(response => response.json())
        .then(json => {
          var db = JSON.stringify(json);

          console.log('search result geted');
          if (type === 'loadMore') this.addComicObj.searchComicList = this.addComicObj.searchComicList.concat(JSON.parse(db));
          else this.addComicObj.searchComicList = JSON.parse(db);
          this.isLoading = false;
          this.addComicObj.searchError = false;
        })
        .catch((error) => {
          if (error.name === "TimeoutError") {
            console.error("Timeout: It took more than 5 seconds to get the result!");
            this.addComicObj.searchError = '搜尋超時，可能是伺服器障礙，請重試。'
            this.isLoading = false;
          }
          else {
            console.log(error);
            this.addComicObj.searchError = '異常：' + error
            this.isLoading = false;
          }
        })


    },

    // 用於新增評論的表單相關
    sendComment(type) {

      if (type === 'addComic') {
        this.commentFormObj.tagInputText = $('#addComicTags').val();
      } else {
        this.commentFormObj.tagInputText = $('#commentTags').val();
      }


      if (this.commentFormObj.stars == 0 && type == 'addComic') {
        this.commentFormObj.warning = '請選擇推薦星數。';
      } else if (this.commentFormObj.tagInputText.length == 0 && type == 'addComic') {
        this.commentFormObj.warning = '請至少選擇一個標籤。';
      } else if (this.commentFormObj.userName.length == 0 && type != 'delete') {
        this.commentFormObj.warning = '請輸入推薦人。';
      } else if (this.commentFormObj.stars == 0 && this.commentFormObj.userComment.length == 0 && type != 'delete') {
        this.commentFormObj.warning = '星數和留言內容至少擇一輸入。';
      } else {
        this.isLoading = true;

        if (type === 'addComic') {
          var postBody = {
            type: type,
            userName: this.commentFormObj.userName,
            stars: this.commentFormObj.stars,
            tags: this.commentFormObj.tagInputText,
            pw: this.commentFormObj.pw,
            userComment: this.commentFormObj.userComment,
            title: this.addComicObj.searchComicList[this.addComicObj.selected].Title,
            author: this.addComicObj.searchComicList[this.addComicObj.selected].Author.join(),
            url: this.addComicObj.searchComicList[this.addComicObj.selected].Url,
            bigPic: this.addComicObj.searchComicList[this.addComicObj.selected].Pic,
            id: this.addComicObj.searchComicList[this.addComicObj.selected].Id,
            AddTime: String(Date()),
            Pic: this.addComicObj.searchComicList[this.addComicObj.selected].Pic,
            isEnd: (this.addComicObj.searchComicList[this.addComicObj.selected].Status == '已完結' ? true : false),
            lastPartTime: this.addComicObj.searchComicList[this.addComicObj.selected].LastPartTime,
          };
        } else if (type === 'addComment') {
          var postBody = {
            type: type,
            userName: this.commentFormObj.userName,
            stars: this.commentFormObj.stars,
            tags: this.commentFormObj.tagInputText,
            pw: this.commentFormObj.pw,
            userComment: this.commentFormObj.userComment,
            id: this.comicMainPageList[this.selectedComicIndex][0],
          };
        } else if (type === 'changeComment') {
          var postBody = {
            type: type,
            userName: this.commentFormObj.userName,
            stars: this.commentFormObj.stars,
            tags: this.commentFormObj.tagInputText,
            pw: this.commentFormObj.pw,
            userComment: this.commentFormObj.userComment,
            id: this.commentFormObj.selectedCommentId,
          };
        } else if (type === 'delete') {
          var postBody = {
            type: type,
            userName: this.commentFormObj.userName,
            pw: this.commentFormObj.pw,
            id: this.commentFormObj.selectedCommentId,
          };
        }
        var payload = Object.keys(postBody).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(postBody[k])
        }).join('&');
        fetch('https://script.google.com/macros/s/AKfycbzshA7Vgj-ff3dIeizZQhuX7yvNndNCemG1cFTxPWJlliSlA55_/exec'
          , {
            redirect: "follow",
            method: "POST",
            body: JSON.stringify(postBody),
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
          })
          .then(response => {
            return response.json();
          })
          .then(json => {
            console.log(json);
            var db = JSON.stringify(json);
            console.log(db);
            var ajaxData = JSON.parse(db);
            this.isLoading = false;
            if (ajaxData.state === 'success') {
              this.commentFormObj.stars = 0;
              this.commentFormObj.tagInputText = '';
              this.commentFormObj.userComment = '';
              this.commentFormObj.selectedCommentId = 0;

              this.commentFormObj.warning = '';
              if (type === 'addComic') {
                $('#addComicTags').importTags('');
                this.addComicObj.comicModal.hide();
                this.raloadComicList();
                this.raloadTagList();
                this.raloadCommentList();
                // $('#comicDetailModal').modal('hide');
              } else {
                this.commentFormObj.commentMethodType = 'addComment';
                this.raloadComicList();
                this.raloadTagList();
                this.raloadCommentList();
                this.comicMainPageObj.comicModalCollapse.hide();
                this.comicMainPageObj.comicModalCollapsePw.hide();
                //this.search('reload');
                // $('#commentForm').collapse('hide')
              }
            } else if (ajaxData.state === 'duplicated') {
              this.commentFormObj.warning = '書單裡面已有這本漫畫囉，去留言吧！';
            } else if (ajaxData.state === 'pwWrong') {
              this.commentFormObj.warning = '密碼錯誤！';
            } else if (ajaxData.state === 'noPw') {
              this.commentFormObj.warning = '文章沒有密碼，修改失敗。';
            } else {
              this.commentFormObj.warning = ajaxData.state;
            }

          })
          .catch((error) => {
            console.log(error);

          })
      }
    },

    traceComicIndex(comicId) {
      return comicMainPageList.findIndex(p => p[0] == "comicId");
    }

  },

  // 計算屬性
  computed: {
    comicIdList() {
      return this.rawData.comicListArr.map((p) => p[0]);
    },

    selectedComicIndex() {
      let comicIndex = this.comicMainPageList.findIndex(p => p[0] == this.comicMainPageObj.selectedID);
      return comicIndex == -1 ? 0 : comicIndex
    },


    comicMainPageList() {

      var text = this.searchText.toLowerCase();
      var comicList = this.rawData.comicListArr.slice(0);
      var commentList = this.rawData.commentsListArr.slice(0);
      commentList.reverse();
      for (var i = 0; i < comicList.length; i++) {
        for (var j = 0; j < commentList.length; j++) {
          if (comicList[i][0] == commentList[j][1]
            && commentList[j][5] != 1) {
            comicList[i][12] = commentList[j][0]; //12 代表最新留言的序號
            comicList[i][13] = commentList[j][3]; //13 代表最新留言的留言人
            if (!commentList[j][4]) comicList[i][14] = '(評了 ' + commentList[j][2] + ' 星)'; //14 代表最新留言的留言
            else comicList[i][14] = commentList[j][4]; //14 代表最新留言的留言
            break;
          }
        }
      }
      // var comicList = this.comicListWithCommentInfo.slice(0);

      if (this.comicMainPageObj.sortBy === 'time') {
        if (this.comicMainPageObj.sortReverse) comicList.reverse();
      } else if (this.comicMainPageObj.sortBy === 'stars') {
        comicList.reverse();
        if (this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[5] > b[5]) return -1;
            else if (a[5] < b[5]) return 1;
            else if (a[9] > b[9]) return -1;
            else if (a[9] < b[9]) return 1;
            else return 0;
          });
        } else if (!this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[5] > b[5]) return 1;
            else if (a[5] < b[5]) return -1;
            else if (a[9] > b[9]) return -1;
            else if (a[9] < b[9]) return 1;
            else return 0;
          });
        }
      } else if (this.comicMainPageObj.sortBy === 'comments') {
        comicList.reverse();
        if (this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[9] > b[9]) return -1;
            else if (a[9] < b[9]) return 1;
            else if (a[5] > b[5]) return -1;
            else if (a[5] < b[5]) return 1;
            else return 0;
          });
        } else if (!this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[9] > b[9]) return 1;
            else if (a[9] < b[9]) return -1;
            else if (a[5] > b[5]) return -1;
            else if (a[5] < b[5]) return 1;
            else return 0;
          });
        }
      } else if (this.comicMainPageObj.sortBy === 'commentsTime') {
        comicList.reverse();
        if (this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[12] > b[12]) return -1;
            else if (a[12] < b[12]) return 1;
            else if (a[5] > b[5]) return -1;
            else if (a[5] < b[5]) return 1;
            else return 0;
          });
        } else if (!this.comicMainPageObj.sortReverse) {
          comicList.sort(function (a, b) {
            if (a[12] > b[12]) return 1;
            else if (a[12] < b[12]) return -1;
            else if (a[5] > b[5]) return -1;
            else if (a[5] < b[5]) return 1;
            else return 0;
          });
        }
      }
      // return comicList;
      if (this.tabSelected != 'comic' || text.length == 0) return comicList.slice(0, this.loadCardsNum);
      var dis = false;
      if (text.match(/^-/) != null) {
        dis = true;
        text = this.searchText.replace(/^-/, '');
      }


      if (this.searchBy === 'tittle') {
        return comicList.filter(function (value) {
          let tempBool = (String(value[1]).toLowerCase().indexOf(text) != -1 || String(value[2]).toLowerCase().indexOf(text) != -1);
          return (dis ? !tempBool : tempBool);
        }).slice(0, this.loadCardsNum);
      } else if (this.searchBy === 'user') {
        return comicList.filter(function (value) {
          let tempBool = String(value[3]).toLowerCase().indexOf(text) != -1;
          return (dis ? !tempBool : tempBool);
        }).slice(0, this.loadCardsNum);
      } else if (this.searchBy === 'tag') {
        return comicList.filter(function (value) {
          let tempBool = String(value[4]).toLowerCase().indexOf(text) != -1;
          return (dis ? !tempBool : tempBool);
        }).slice(0, this.loadCardsNum);
      }
    },


    selectedCommentList: function () {
      if (this.rawData.commentsListArr.lenth == 0 || this.rawData.comicListArr.lenth == 0) {
        return [];
      }
      if (this.comicMainPageList.length == 0) return [];
      var commentArr = this.rawData.commentsListArr.slice(0);
      if (!this.comicMainPageList[this.selectedComicIndex][0]) return [];
      var comicId = this.comicMainPageList[this.selectedComicIndex][0];
      return commentArr.filter(
        value => {
          return (value[1] == comicId && value[5] == 0) ? true : false;
        });
    },

    famousTags: function () {
      var tempArr = this.rawData.tagsListArr.slice(0);
      // tempArr.splice(15);
      return {
        'notFamous': tempArr.splice(15),
        'famous': tempArr
      };
    },

  },

  watch: {
    bottomVisible(newValue, oldValue) {
      if (newValue &&
        this.loadCardsNum <= this.rawData.comicListArr.length &&
        this.tabSelected == 'comic'  
      ) {


        if(this.searchText.length == 0)this.loadCardsNum += 20;
        else if(this.loadCardsNum <= this.comicMainPageList.length)this.loadCardsNum += 20;
      }
    },
    tabSelected(newValue, oldValue) {
      this.loadCardsNum = 20;
    },
    searchText(newValue, oldValue) {
      if (newValue.length == 0) {
        this.loadCardsNum = 20;
        window.scrollTo(0,0);
      }
    }

  },

  mounted() {
    console.log(`the component is now mounted.`)
    this.comicMainPageObj.comicModal = new bootstrap.Modal('#mainComicModal', {});
    this.addComicObj.comicModal = new bootstrap.Modal('#addComicModal', {});
    this.comicMainPageObj.comicModalCollapse = new bootstrap.Collapse('#commentForm', { toggle: false });
    this.comicMainPageObj.comicModalCollapsePw = new bootstrap.Collapse('#commentFormPw', { toggle: false });
    // console.log(this.comicMainPageObj);
    this.raloadComicList();
    this.raloadCommentList();
    this.raloadTagList();
    $('#commentTags').tagsInput({
      'unique': true,
      'defaultText': '添加標籤',
      'placeholderColor': '#666666'
    });
    $('#addComicTags').tagsInput({
      'unique': true,
      'defaultText': '添加標籤',
      'placeholderColor': '#666666'
    });
    this.bottomVisible = useElementVisibility(this.$refs.pageBottom)
  }
}