import { AdminModel } from "../models/admin.model";
import * as bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    const result = await AdminModel.create({
      name: "superadmin",
      phone: "0207573792",
      password: hashedPassword,
    });
    if (!result) {
      throw Error("Error creating admin");
    }
  } catch (err) {
    console.log("admin error", err);
  }
};

createAdmin();
