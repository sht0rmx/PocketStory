import { defineStore } from "pinia";
import { v4 as uuid4 } from "uuid";
import Ajv from "ajv";
import storySchema from "@/stores/shema.json";

const ajv = new Ajv();
export const validate = ajv.compile(storySchema);

const createStoryObj = ({
  name = "New story",
  description = "",
  cover = "",
} = {}) => ({
  name,
  description,
  cover,
  characters: {},
  scenes: {},
});

const createCharacterObj = ({
  name = "Simple Name",
  age = 10,
  gender = "M",
  bio = "",
  color = "#9CA3AF",
} = {}) => ({
  name,
  age,
  gender,
  bio,
  color,
});

const createSceneObj = ({
  title = "New scene",
  description = "",
  characters = [],
} = {}) => ({
  title,
  description,
  characters,
  messages: {},
});

const createMessageObj = ({ by = null, text = "" } = {}) => ({
  by,
  text,
  createdAt: Date.now(),
});

export const useSavesStore = defineStore("saves", {
  state: () => ({
    allStories: {},
  }),

  getters: {
    storiesList: (state) =>
      Object.entries(state.allStories).map(([id, s]) => ({
        id,
        name: s.name,
        description: s.description,
      })),
    getStory: (state) => (id) => state.allStories[id] || null,
    getScene: (state) => (sId, scId) =>
      state.allStories[sId]?.scenes?.[scId] || null,
    getCharacter: (state) => (sId, cId) =>
      state.allStories[sId]?.characters?.[cId] || null,
  },
  actions: {
    createStory(data) {
      const id = uuid4();
      this.allStories[id] = createStoryObj(data);
      return id;
    },
    updateStory(id, data) {
      if (this.allStories[id]) {
        Object.assign(this.allStories[id], data);
      }
    },
    deleteStory(id) {
      delete this.allStories[id];
    },
    createCharacter(storyId, data) {
      const charId = uuid4();
      const story = this.getStory(storyId);
      if (story) story.characters[charId] = createCharacterObj(data);
      return charId;
    },
    updateCharacter(storyId, charId, data) {
      const char = this.getCharacter(storyId, charId);
      if (char) Object.assign(char, data);
    },
    deleteCharacter(storyId, charId) {
      const story = this.getStory(storyId);
      if (story) delete story.characters[charId];
    },
    createScene(storyId, data) {
      const sceneId = uuid4();
      const story = this.getStory(storyId);
      if (story) story.scenes[sceneId] = createSceneObj(data);
      return sceneId;
    },
    updateScene(storyId, sceneId, data) {
      const scene = this.getScene(storyId, sceneId);
      if (scene) Object.assign(scene, data);
    },
    deleteScene(storyId, sceneId) {
      const story = this.getStory(storyId);
      if (story) delete story.scenes[sceneId];
    },
    addMessage(storyId, sceneId, data) {
      const msgId = uuid4();
      const scene = this.getScene(storyId, sceneId);
      if (scene) scene.messages[msgId] = createMessageObj(data);
      return msgId;
    },
    updateMessage(storyId, sceneId, msgId, data) {
      const scene = this.getScene(storyId, sceneId);
      if (scene?.messages[msgId]) {
        Object.assign(scene.messages[msgId], data);
      }
    },
    deleteMessage(storyId, sceneId, msgId) {
      const scene = this.getScene(storyId, sceneId);
      if (scene?.messages) delete scene.messages[msgId];
    },
    exportSaves(ids = null) {
      let dataToExport = {};
      if (!ids) {
        dataToExport = this.allStories;
      } else {
        const targetIds = Array.isArray(ids) ? ids : [ids];
        targetIds.forEach((id) => {
          if (this.allStories[id]) dataToExport[id] = this.allStories[id];
        });
      }
      return JSON.stringify(structuredClone(dataToExport), null, 2);
    },

    importStory(storyData) {
      if (!validate(storyData)) {
        console.warn("Import: Invalid story structure", validate.errors);
        return null;
      }

      const newId = uuid4();
      const storyCopy = JSON.parse(JSON.stringify(storyData));

      this.allStories[newId] = {
        ...createStoryObj(storyCopy),
        characters: storyCopy.characters || {},
        scenes: storyCopy.scenes || {},
      };

      return newId;
    },
    clearState() {
      this.allStories = {};
    },
  },
  persist: true,
});
