export interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  timestamp: string;
  permalink: string;
}

export interface InstagramResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}
