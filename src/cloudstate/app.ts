import { FeatureRequestsListCS } from "./feature-requests";
import { cloudstate } from "freestyle-sh";
import {
  PasskeyAuthentication,
  type FinishPasskeyRegistrationJSON,
} from "./auth";

@cloudstate
export class UserCS {
  constructor(
    public id: string,
    public username: string,
    public image: ImageCS,
    public displayName?: string
  ) {}

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  getPersonalInfo() {
    return {
      username: this.username,
      id: this.id,
      image: this.image.getUrlPath(),
      displayName: this.displayName,
    };
  }

  getPublicInfo() {
    return {
      displayName: this.displayName,
      image: this.image.getUrlPath(),
    };
  }
}

@cloudstate
class ImageCS {
  id = crypto.randomUUID();
  constructor(public blob: Blob) {}

  async fetch() {
    return new Response(await this.blob.arrayBuffer(), {
      headers: {
        "content-type": this.blob.type,
        "content-length": this.blob.size.toString(),
      },
    });
  }

  getUrlPath() {
    return `/cloudstate/instances/${this.id}`;
  }
}

@cloudstate
export class FeatureRequestsAppCS extends PasskeyAuthentication {
  static id = "feature-requests-app" as const;
  users: UserCS[] = [];
  featureList = new FeatureRequestsListCS("feature-requests-list", this);

  async finishRegistration(passkey: FinishPasskeyRegistrationJSON) {
    const info = await super.finishRegistration(passkey);
    const blob = await fetch("https://picsum.photos/200/200").then((res) =>
      res.blob()
    );
    const user = new UserCS(info.id, info.username, new ImageCS(blob));
    this.users.push(user);
    return {
      id: user.id,
      username: user.username,
    };
  }

  getCurrentUser() {
    const info = super.getCurrentUser();
    if (!info) return;
    return this.users.find((user) => user.id === info.id);
  }

  getUserInfo() {
    return this.getCurrentUser()?.getPersonalInfo();
  }

  getDefiniteCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
