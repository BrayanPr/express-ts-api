import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UserRoles, EnglishLevel, User as IUser, Team as ITeam } from "../../types";
import Team from "./Team.model";

@Table({
  timestamps: false,
  tableName: 'users'
})
export default class User extends Model implements IUser {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ''
  })
  experience!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  cv!: string;

  @Column({
    type: DataType.ENUM,
    values: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    defaultValue: 'A1'
  })
  englishLevel!: EnglishLevel;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true
  })
  teamId!: number | null;

  @BelongsTo(() => Team)
  team!: ITeam | null;

  @Column({
    type: DataType.ENUM,
    values: ['user', 'admin', 'super_admin'],
    allowNull: false,
    defaultValue: 'user'
  })
  role!: UserRoles;
}
