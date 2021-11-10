<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="loading" class="loading">Loading...</v-col>
      <v-col cols="6" offset="2" v-if="post">
        <v-card>
          <v-card-title>
            <span>{{ post.title }}</span>
            <v-spacer />
            <span>by {{ post.author.login }}</span>
          </v-card-title>
          <v-card-subtitle> {{ post.timestamp }} </v-card-subtitle>

          <v-card-text>
            <div>
              Tags: <span class="tags">{{ tagsAsString }}</span>
            </div>
            <v-divider />
            <div class="post">
              {{ post.body }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn :to="{ name: 'PostUpdate', params: { id: post.id } }" color="primary"> Edit </v-btn>
            <v-btn @click="back()"> Back </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4" v-if="post">
        <v-img :src="imageSrc"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PostRepository from "@/repositories/PostRepository";

export default {
  data() {
    return {
      loading: false,
      post: null,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      this.post = await PostRepository.findOne(this.$route.params.id);
    } catch (e) {
      this.$notify({
        text: e.response.data.message,
        type: "error",
      });
      setTimeout(() => this.back(), 2000);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    tagsAsString() {
      return this.post.tags.map((t) => t.name).join(", ");
    },
    imageSrc() {
      if (this.post.hasImage) {
        return `http://localhost:8080/api/posts/${this.post.id}/image`;
      }
      return "/placeholder.png";
    },
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.tags {
  font-style: italic;
}
.post {
  padding: 30px 50px;
  color: rgba(0, 0, 0, 0.87);
  font-size: larger;
}

.error {
  margin-top: 40px;
}
</style>
