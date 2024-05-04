export default {
  props: ['comic', 'index'],
  computed: {
    // 一个计算属性的 getter
    isNew() {
      var now = new Date();
      var postTime = new Date(this.comic[8]);
      if (parseInt(now - postTime) / 3600000 < 24) return true;
      else return false;
    },
    isEnd() {
      if (this.comic[10] === true) return true;
      else return false;
    },
    isTailless() {
      var now = new Date();
      var postTime = new Date(this.comic[11]);
      if (parseInt(now - postTime) / 3600000 / 24 > 180 && !this.isEnd) return true;
      else return false;
    },
    isUgly() {
      return (this.comic[5] <= 0);
    }
  }, methods: {
    clickUser(user) {
      this.$emit('comicClicked', { type: 'user', data: user });
    },
    clickTag(tagName) {
      this.$emit('comicClicked', { type: 'tag', data: tagName });
    },
    clickComic(index) {
      this.$emit('comicClicked', { type: 'comic', data: this.comic[0] });
    },
  },



  template: /*html*/`
    <div class = "col-12  col-sm-6 col-md-4 col-lg-3 mt-2 px-1">
      <div class="card px-0 cursor_pointer" @click="clickComic(index)">
          <div class="card-header" :class="{ 'bg-black text-light' : isUgly }">
            <h6 class="mb-0">{{comic[1]}}</h6>
          </div>
          <div class="card-body p-2" :class="{ 'bg-black bg-gradient text-light' : isUgly }">
            <div class="clearfix">
              <div class="col-4 col-sm-6  position-relative float-start m-1 ">
                <img class="img-fluid rounded " :src="comic[6]" :class="{ 'grayscale' : isUgly }">
                <div  class="position-absolute top-0 start-0 p-0 d-flex align-items-start">
                  <span class="badge bg-danger my-0 me-1" v-if="isNew">NEW</span>
                  <span class="badge bg-success my-0  me-1" v-if="isEnd">完結</span>
                  <span class="badge bg-warning text-dark my-0  me-1" v-if="isTailless">疑似棄坑</span>       
                </div>
                
              </div>


                <p class="card-subtitle mb-1" >推薦人：<span @click.stop="clickUser(comic[3])">{{comic[3]}}</span></p>
                <template v-if="!isUgly">
                  <span class='text-warning' v-for="n in Math.round(comic[5])">★</span>
                  <span v-for="n in 3-Math.round(comic[5])">☆</span><span>({{comic[5]}})</span>
                </template>
                <span v-else class="text-danger">💀💀💀</span>
                <p class="card-text mb-1">{{comic[9]}} 則評論。</p>
                <p class="card-text">
                  <span class="badge text-bg-secondary me-1 cursor_pointer"
                    v-for="tag in comic[4].split(',')" @click.stop="clickTag(tag)">{{tag}}</span>
                </p>

            </div>
          </div>
          <div class="card-footer  text-truncate" :class=
          "{'bg-black bg-gradient text-light' : isUgly ,
          'text-body-secondary' : !isUgly}">
          <em>{{comic[13]+': '+comic[14]}}</em>
          </div>
      </div>
    </div>
    `
}

// <div class="card-body" :class="{ 'bg-black bg-gradient text-light' : isUgly }">
//             <div class="row g-2">

//               <div class="col-12 col-md-6 position-relative">
//                 <img class="img-fluid rounded " :src="comic[6]" :class="{ 'grayscale' : isUgly }">

//                 <span class="position-absolute top-0 start-0 translate-middle  badge rounded-pill bg-danger" v-if="isNew">NEW</span>
//               </div>

//               <div class="col-12 col-md-6">
//                 <p class="card-subtitle mb-1">推薦人：{{comic[3]}}</p>
//                 <template v-if="!isUgly">
//                   <span class='text-warning' v-for="n in Math.round(comic[5])">★</span>
//                   <span v-for="n in 3-Math.round(comic[5])">☆</span><span>({{comic[5]}})</span>
//                 </template>
//                 <span v-else class="text-danger">💀💀💀</span>
//                 <p class="card-text mb-1">{{comic[9]}} 則評論。</p>
//                 <p class="card-text">
//                   <a class="badge text-bg-secondary me-1"
//                     v-for="tag in comic[4].split(',')">{{tag}}</a>
//                 </p>

//               </div>
//             </div>
//           </div>