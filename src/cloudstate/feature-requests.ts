import { cloudstate } from "freestyle-sh";
import { type DefiniteAuthenticatorCS } from "./auth";
import type { UserCS } from "./app";

@cloudstate
export class FeatureRequestCS {
  id = crypto.randomUUID();
  private votes: UserCS[] = [];

  constructor(
    private auth: DefiniteAuthenticatorCS<UserCS>,
    public description: string,
    public title: string,
    public creator: UserCS
  ) {}

  upvote() {
    const user = this.auth.getDefiniteCurrentUser();
    this.votes.push(user);
  }

  getInfo() {
    const user = this.auth.getDefiniteCurrentUser();
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      votes: this.votes.length,
      isOwner: this.creator === user,
      ownerDisplayName: this.creator.username,
      ownerImageUrl: this.creator.image.getUrlPath(),
    };
  }
}

@cloudstate
export class FeatureRequestsListCS {
  requests: FeatureRequestCS[] = [];
  deletedRequests: FeatureRequestCS[] = [];

  constructor(
    public id: string,
    public auth: DefiniteAuthenticatorCS<UserCS>
  ) {}

  createRequest(title: string, description: string) {
    const user = this.auth.getDefiniteCurrentUser();
    const request = new FeatureRequestCS(this.auth, title, description, user);
    this.requests.push(request);
    return request.getInfo();
  }

  deleteRequest(id: string) {
    const user = this.auth.getDefiniteCurrentUser();
    const request = this.requests.find((r) => r.id === id);

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.creator !== user) {
      throw new Error("You are not authorized to delete this feature request");
    }

    this.deletedRequests.push(request);
    this.requests = this.requests.filter((r) => r.id !== id);
  }

  getRequests() {
    return this.requests.map((request) => request.getInfo());
  }
}
