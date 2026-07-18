import { Role } from "./Role.model";
import { User } from "./User.model";
import { PasswordResetToken } from "./PasswordResetToken.model";
import { Activity } from "./Activity.model";
import { MembershipPlan } from "./MembershipPlan.model";
import { UserSubscription } from "./UserSubscription.model";
import { Payment } from "./Payment.model";
import { Schedule } from "./Schedule.model";
import { ClassReservation } from "./ClassReservation.model";
import { CheckIn } from "./CheckIn.model";
import { Routine } from "./Routine.model";

export const setupAssociations = () => {
    // Role - User
    Role.hasMany(User, { foreignKey: "role_id", as: "usuarios" });
    User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

    // User - PasswordResetToken
    User.hasMany(PasswordResetToken, { foreignKey: "user_id", as: "reset_tokens" });
    PasswordResetToken.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

    // User - UserSubscription
    User.hasMany(UserSubscription, { foreignKey: "user_id", as: "suscripciones" });
    UserSubscription.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

    // MembershipPlan - UserSubscription
    MembershipPlan.hasMany(UserSubscription, { foreignKey: "plan_id", as: "suscripciones" });
    UserSubscription.belongsTo(MembershipPlan, { foreignKey: "plan_id", as: "plan" });

    // UserSubscription - Payment
    UserSubscription.hasMany(Payment, { foreignKey: "subscription_id", as: "pagos" });
    Payment.belongsTo(UserSubscription, { foreignKey: "subscription_id", as: "suscripcion" });

    // User (admin) - Payment
    Payment.belongsTo(User, { foreignKey: "registered_by", as: "registradoPor" });

    // Activity - Schedule
    Activity.hasMany(Schedule, { foreignKey: "activity_id", as: "horarios" });
    Schedule.belongsTo(Activity, { foreignKey: "activity_id", as: "actividad" });

    // User (profesor) - Schedule
    User.hasMany(Schedule, { foreignKey: "professor_id", as: "clasesAsignadas" });
    Schedule.belongsTo(User, { foreignKey: "professor_id", as: "profesor" });

    // Schedule - ClassReservation
    Schedule.hasMany(ClassReservation, { foreignKey: "schedule_id", as: "reservas" });
    ClassReservation.belongsTo(Schedule, { foreignKey: "schedule_id", as: "horario" });

    // User - ClassReservation
    User.hasMany(ClassReservation, { foreignKey: "user_id", as: "reservas" });
    ClassReservation.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

    // User - CheckIn
    User.hasMany(CheckIn, { foreignKey: "user_id", as: "check_ins" });
    CheckIn.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

    // User (admin) - CheckIn
    CheckIn.belongsTo(User, { foreignKey: "registered_by", as: "registradoPor" });

    // User - Routine
    User.hasMany(Routine, { foreignKey: "user_id", as: "rutinas" });
    Routine.belongsTo(User, { foreignKey: "user_id", as: "usuario" });

    // User (profesor) - Routine
    User.hasMany(Routine, { foreignKey: "professor_id", as: "rutinasCreadas" });
    Routine.belongsTo(User, { foreignKey: "professor_id", as: "profesor" });
};

export {
    Role,
    User,
    PasswordResetToken,
    Activity,
    MembershipPlan,
    UserSubscription,
    Payment,
    Schedule,
    ClassReservation,
    CheckIn,
    Routine
};
