import { FeatureRequestsListCS } from "./feature-requests";
import { cloudstate } from "freestyle-sh";
import {
  PasskeyAuthentication,
  type FinishPasskeyRegistrationJSON,
} from "./auth";

@cloudstate
export class UserCS {
  constructor(public id: string, public username: string) {}

  getInfo() {
    return {
      id: this.id,
    };
  }
}

@cloudstate
export class FeatureRequestsAppCS extends PasskeyAuthentication {
  static id = "feature-requests-app" as const;
  users = new Map<string, UserCS>();
  featureList = new FeatureRequestsListCS("feature-requests-list", this);

  async finishRegistration(passkey: FinishPasskeyRegistrationJSON) {
    const info = await super.finishRegistration(passkey);
    const user = new UserCS(info.id, info.username);
    this.users.set(user.id, user);
    return {
      id: user.id,
      username: user.username,
    };
  }

  getCurrentUser() {
    const info = super.getCurrentUser();
    if (!info) return;
    return this.users.get(info.id);
  }

  getDefiniteCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
