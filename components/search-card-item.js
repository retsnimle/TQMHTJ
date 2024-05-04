export default {
    props: ['comic', 'index' ,'comicIdList'],
    computed: {
      // 一个计算属性的 getter

      alreadyHas() {
        return this.comicIdList.includes(this.comic.Id);

      },
   
      isEnd() {
        if (this.comic.Status == '已完結') return true;
        else return false;
      },
      isTailless() {
        var now = new Date();
        var postTime = new Date(this.comic.LastPartTime);
        if (parseInt(now - postTime) / 3600000 / 24 > 180 && !this.isEnd) return true;
        else return false;
      }      
    }, methods: {
      clickComic(index) {
        if(this.alreadyHas) this.$emit('comicClicked', { type: 'already', data: this.comic.Id });
        else this.$emit('comicClicked', { type: 'comic', data: index });
      },
    },
  
  
  
    template: /*html*/`
      <div class = "col-12  col-sm-6 col-md-4 col-lg-3 mt-2 px-1">
        <div class="card px-0 cursor_pointer" @click="clickComic(index)">
            <div class="card-header" >
              <h6 class="mb-0">{{comic.Title}}</h6>
            </div>
            <div class="card-body p-2" >
              <div class="clearfix">
                <div class="col-4 col-sm-6  position-relative float-start m-1 ">
                  <img class="img-fluid rounded " :src="comic.Pic" >
                  <div  class="position-absolute top-0 start-0 p-0 d-flex align-items-start">
                  <span class="badge bg-danger my-0  me-1" v-if="alreadyHas">已在資料庫中</span>
                    <span class="badge bg-success my-0  me-1" v-if="isEnd">完結</span>
                    <span class="badge bg-warning text-dark my-0  me-1" v-if="isTailless">疑似棄坑</span>       
                  </div>
                  
                </div>
  
  
                  <p class="card-subtitle mb-1">作者：{{comic.Author.join(', ')}}</p>
                  <p class="card-text">
                    <span class="badge text-bg-secondary me-1 cursor_pointer"
                      v-for="tag in comic.TagList" @click.stop="clickTag(tag)">{{tag}}</span>
                  </p>
                  <p class="card-text">
                    {{comic.Content}}
                  </p>
  
  
              </div>
            </div>
        </div>
      </div>
      `
  }
  