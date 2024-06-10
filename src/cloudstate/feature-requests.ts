import { cloudstate } from "freestyle-sh";
import { type DefiniteAuthenticatorCS } from "freestyle-auth/passkey";
import type { UserCS } from "./app";

@cloudstate
export class FeatureRequestCS {
  id = crypto.randomUUID();
  private votes: UserCS[] = [];

  constructor(
    private auth: DefiniteAuthenticatorCS<UserCS>,
    public title: string,
    public description: string,
    public creator: UserCS
  ) {}

  upvote() {
    const user = this.auth.getDefiniteCurrentUser();
    if (this.votes.find((u) => u.id === user.id)) {
      this.votes = this.votes.filter((u) => u.id !== user.id);
    } else {
      this.votes.push(user);
    }

    return {
      votes: this.votes.length,
      currentUserVoted: this.votes.some((u) => u.id === user.id),
    };
  }

  currentUserVoted() {
    const user = this.auth.getCurrentUser();
    return user && this.votes.includes(user);
  }

  update(options: { title?: string; description?: string }) {
    const user = this.auth.getDefiniteCurrentUser();
    if (user !== this.creator) {
      throw new Error("You are not authorized to update this feature request");
    }
    this.title = options.title ?? this.title;
    this.description = options.description ?? this.description;
  }

  getInfo() {
    const user = this.auth.getCurrentUser();
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      votes: this.votes.length,
      isOwner: this.creator === user,
      ownerDisplayName: this.creator.displayName,
      ownerImageUrl: this.creator.image.getUrlPath(),
      currentUserVoted: this.currentUserVoted(),
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
    request.upvote();
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
    return this.requests.map((request) => request.getInfo()).reverse();
  }
}
