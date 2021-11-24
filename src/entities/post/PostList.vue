<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-inline-block">
          <h1>Blog Posts</h1>
          <div class="caption">Data fetched <span class="font-weight-bold">after</span> navigation</div>
        </div>
        <div class="float-right">
          <v-text-field v-model="query" label="Filter posts" class="d-inline-block" @input="updateData()"></v-text-field>
          <v-select :items="sortOptions" v-model="sort" item-value="value" item-text="label" label="Sort by" class="d-inline-block select" @input="fetchData()"></v-select>
          <v-btn :to="{ name: 'PostCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" sm="6" lg="3" v-for="post in posts" :key="post.id">
        <PostCard :post="post"></PostCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostCard from "./PostCard.vue";
import PostRepository from "@/repositories/PostRepository";

let delay = null;
const sortOptions = [
  { label: "Most recent", value: "MOST_RECENT" },
  { label: "Less recent", value: "LESS_RECENT" },
  { label: "Author name", value: "AUTHOR_NAME" },
];

export default {
  data() {
    return {
      posts: [],
      query: null,
      sort: sortOptions[0].value,
      sortOptions,
    };
  },
  components: { PostCard },
  mounted() {
    this.fetchData();
  },
  methods: {
    updateData() {
      clearTimeout(delay);
      delay = setTimeout(this.fetchData, 500);
    },
    async fetchData() {
      this.posts = await PostRepository.findAll(this.query);
    },
  },
};
</script>

<style scoped>
.select {
  width: 150px;
}
</style>
