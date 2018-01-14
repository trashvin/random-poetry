export class Poem {
  _id: any;
  author: string;
  date_submitted: Date;
  likes: number;
  poem: string;
  for_email: string;
  public: boolean;
  tags: string;
  owner_id: string;  // also serves as author_id
  title: string;
  own_poem: boolean;
  published: boolean;
  constructor() {
  }
  get arrayOfTags(): string[] {
    let tags = [];

    if (tags !== undefined) {
      tags = this.tags.split(";");
    }
    return tags;
  }
  set arrayOfTags(data){
    this.arrayOfTags = data;
  }
  get formattedDate(): string {
    return this.date_submitted.toDateString();
  }
  set formattedDate(data) {
    this.formattedDate = data;
  }
}
