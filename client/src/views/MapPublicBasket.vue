<template>
  <div>
    map des public basket
    <button @click="getPB">Zinzin</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicBasket: null,
    };
  },
  components: {
  },
  computed: {
    idPublicBasket() {
      return this.$route.params.id;
    },
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('getPublicBasketsById', { id: this.idPublicBasket }).then(() => {
      this.publicBasket = this.$store.getters.publicBasketById;
    });
  },
  methods: {
  },

};

</script>
