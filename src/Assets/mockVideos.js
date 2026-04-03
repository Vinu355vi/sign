const defaultVideos = [
    {
      _id: "1",
      title: "Welcome to Silent Talk",
      desc: "An introduction to our sign language platform.",
      content: "WELCOME TO SILENT TALK",
      createdBy: "Admin"
    },
    {
      _id: "2",
      title: "Common Greetings",
      desc: "Learn how to say hello and goodbye.",
      content: "HELLO GOODBYE",
      createdBy: "Admin"
    },
    {
        _id: "3",
        title: "Alphabet Demo",
        desc: "Demonstration of A to Z alphabets.",
        content: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        createdBy: "Admin"
    },
     {
      _id: "4",
      title: "Simple Sentence",
      desc: "A simple sentence example.",
      content: "I AM A PERSON",
      createdBy: "User1"
    }
  ];

const getStoredVideos = () => {
    const stored = localStorage.getItem('sign_kit_videos');
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize if empty
    localStorage.setItem('sign_kit_videos', JSON.stringify(defaultVideos));
    return defaultVideos;
};

// Start with stored videos
export const mockVideos = getStoredVideos();

export const getVideos = () => {
    return getStoredVideos();
};

export const getVideoById = (id) => {
    const videos = getStoredVideos();
    return videos.find(v => v._id === id);
}

export const addVideo = (video) => {
    const videos = getStoredVideos();
    const safeId = Date.now().toString();
    const newVideo = { ...video, _id: safeId };
    videos.push(newVideo);
    localStorage.setItem('sign_kit_videos', JSON.stringify(videos));
    return newVideo;
};