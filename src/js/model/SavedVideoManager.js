import { LOCAL_STORAGE_SAVED_VIDEO_KEY, MAX_NUM_OF_SAVED_VIDEO } from '../constants/index.js';
import { getLocalStorageItem, setLocalStorageItem } from '../util/index.js';

export const SAVED_VIDEO_SUBSCRIBER_KEY = Object.freeze({
  SAVE: 'save',
  DELETE: 'delete',
  CHECK: 'check',
});

export class SavedVideoManager {
  constructor(defaultValue = {}) {
    const { SAVE, DELETE, CHECK } = SAVED_VIDEO_SUBSCRIBER_KEY;

    this.subscribers = {
      [SAVE]: [],
      [DELETE]: [],
      [CHECK]: [],
    };
    this.savedVideos = getLocalStorageItem({ key: LOCAL_STORAGE_SAVED_VIDEO_KEY, defaultValue });
  }

  subscribe({ key, subscriber }) {
    this.subscribers[key].push(subscriber);
  }

  unsubscribe({ key, subscriber }) {
    const subscriberIndex = this.subscribers[key].indexOf(subscriber);

    if (subscriberIndex === -1) {
      return;
    }

    this.subscribers[key].splice(subscriberIndex, 1);
  }

  saveVideo(videoId) {
    if (this.getSavedVideoIdList().length >= MAX_NUM_OF_SAVED_VIDEO) {
      return false;
    }

    this.setState({
      key: SAVED_VIDEO_SUBSCRIBER_KEY.SAVE,
      videoId,
      savedVideos: { ...this.savedVideos, [videoId]: { isWatched: false, isLiked: false, savedDate: Date.now() } },
    });

    return true;
  }

  likeVideo(videoId) {
    const temp = { ...this.savedVideos };
    temp[videoId].isLiked = !temp[videoId].isLiked;

    this.setState({
      key: SAVED_VIDEO_SUBSCRIBER_KEY.CHECK,
      savedVideos: temp,
    });
  }

  deleteVideo(videoId) {
    const temp = { ...this.savedVideos };
    delete temp[videoId];

    this.setState({
      key: SAVED_VIDEO_SUBSCRIBER_KEY.DELETE,
      savedVideos: temp,
    });
  }

  watchVideo(videoId) {
    const temp = { ...this.savedVideos };
    temp[videoId].isWatched = !temp[videoId].isWatched;

    this.setState({
      key: SAVED_VIDEO_SUBSCRIBER_KEY.CHECK,
      savedVideos: temp,
    });
  }

  getSavedVideos() {
    return { ...this.savedVideos };
  }

  getSavedVideoIdList() {
    return Object.keys(this.savedVideos);
  }

  getSortedSavedVideoIdList() {
    return Object.keys(this.savedVideos).sort((a, b) => this.savedVideos[b].savedDate - this.savedVideos[a].savedDate);
  }

  setState({ key, videoId, savedVideos }) {
    this.savedVideos = savedVideos;
    setLocalStorageItem({ key: LOCAL_STORAGE_SAVED_VIDEO_KEY, item: this.savedVideos });

    this.notify(key, videoId);
  }

  notify(key, videoId) {
    this.subscribers[key].forEach(subscriber => subscriber(videoId));
  }
}
