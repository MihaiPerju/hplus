import { Meteor } from "meteor/meteor";
import Security from "/imports/api/security/security.js";
import { roleGroups } from "/imports/api/users/enums/roles";
import Letters from "../collection.js";
import Statuses from "/imports/api/letters/enums/statuses.js";

Meteor.methods({
  "letter.create"(data) {
    Security.isAllowed(this.userId, roleGroups.ALL);
    Letters.insert(data);
  },

  "letter.get"(letterId) {
    Security.isAllowed(this.userId, roleGroups.ALL);
    return Letters.findOne(letterId);
  },

  "letter.delete"(letterId) {
    Security.isAllowed(this.userId, roleGroups.ALL);
    const { status } = Letters.findOne({ _id: letterId });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }
    Letters.remove(letterId);
  },

  "letter.update"(_id, { body, letterTemplateId, attachmentIds, letterValues }) {
    Security.isAllowed(this.userId, roleGroups.ALL);
    const { status } = Letters.findOne({ _id });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }

    Letters.update(
      { _id },
      {
        $set: {
          body,
          letterTemplateId,
          attachmentIds,
          letterValues
        }
      }
    );
  }
});
