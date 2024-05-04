export default {
  props: ['comment', 'index', 'selectedCommentId'],
  methods: {
    changeComment() {
      this.$emit('commentClicked', { type: 'change', data: this.comment[0] });
    },
    deleteComment() {
      this.$emit('commentClicked', { type: 'delete', data: this.comment[0] });
    },
  },
  computed: {
    isSelected() {
      return (this.selectedCommentId == this.comment[0]);
    }
  }
  ,

  template: /*html*/`
    <li class="list-group-item" :class = "{ 'list-group-item-success': isSelected}">
    <div class="d-flex">
      <span class="flex-grow-1"><strong>{{comment[3]}}</strong>
      
        <span v-show='comment[2] != 0'>

          (
            <template v-if="comment[2] > 0">
              <span class='text-warning' v-for="n in Math.round(comment[2])">★</span>
              <span v-for="n in 3-Math.round(comment[2])">☆</span>
            </template>
            <span v-else class='text-danger'>💀💀💀</span>

        )
        </span>
        ：
      </span>
      <span class="align-middle">
        <span class="badge text-bg-primary me-1 text-white cursor_pointer" @click="changeComment()">修改</span>
        <span class="badge text-bg-danger text-white cursor_pointer" @click="deleteComment()">刪除</span>
      </span>
    </div>    
    <span style="white-space: pre-wrap;">{{isSelected ? '已選擇此評論，請向下捲動到最底' : comment[4]}}</span>
  </li>
      `
}
