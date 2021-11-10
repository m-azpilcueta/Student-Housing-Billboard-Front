<template>
  <v-card>
    <v-img class="blue--text align-end" :src="getImageSrc(post)">
      <v-card-title>
        <router-link :to="{ name: 'PostDetail', params: { id: post.id } }" v-slot="{ navigate }" custom>
          <span @click="navigate" class="pointer">{{ post.title }}</span>
        </router-link>
        <v-spacer />
        <span>by {{ post.author.login }}</span>
      </v-card-title>
      <v-card-subtitle> {{ post.timestamp }} </v-card-subtitle>

      <v-card-text v-if="post.tags.length > 0">
        Tags: <span class="tags">{{ tagsAsString(post.tags) }}</span>
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    tagsAsString(tags) {
      return tags.map((t) => t.name).join(", ");
    },
    getImageSrc(post) {
      if (post.hasImage) {
        return `http://localhost:8080/api/posts/${this.post.id}/image`;
      }
      return "/placeholder.png";
    },
  },
};
</script>

<style scoped>
.tags {
  font-style: italic;
}
</style>
