<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <div class="right-buttons-bar">
          <v-text-field v-model="query" label="Filter posts" class="d-inline-block" @input="fetchData()"></v-text-field>
          <v-btn :to="{ name: 'PostCreate' }" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <h1>Blog Posts</h1>
        <div class="caption">Data fetched <span class="font-weight-bold">after</span> navigation</div>
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

export default {
  data() {
    return {
      posts: [],
      query: null,
    };
  },
  components: { PostCard },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.posts = await PostRepository.findAll(this.query);
    },
  },
};
</script>
