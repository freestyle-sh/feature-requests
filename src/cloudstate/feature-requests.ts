import { cloudstate } from "freestyle-sh";
import { type BaseUserCS, type DefiniteAuthenticatorCS } from "./auth";

@cloudstate
export class FeatureRequestCS {
  id = crypto.randomUUID();
  private votes: BaseUserCS[] = [];

  constructor(
    private auth: DefiniteAuthenticatorCS,
    public description: string,
    public title: string,
    public creator: BaseUserCS
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
    };
  }
}

@cloudstate
export class FeatureRequestsListCS {
  requests: FeatureRequestCS[] = [];
  deletedRequests: FeatureRequestCS[] = [];

  constructor(public id: string, public auth: DefiniteAuthenticatorCS) {}

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
