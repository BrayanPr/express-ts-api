import { Table, Model, Column, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import { History as IHistory, Team as ITeam, User as IUser } from "../../types";
import Team from "./Team.model";
import User from "./User.model";

@Table({
  timestamps: false,
  tableName: 'history'
})
export default class History extends Model implements IHistory {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false
  })
  user!: number;

  @BelongsTo(() => User, { foreignKey: 'user' })
  userRef!: IUser;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true
  })
  teamLeft!: number | null;
  
  @BelongsTo(() => Team, { foreignKey: 'teamLeft' })
  teamLeftRef!: ITeam | null;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false
  })
  teamJoin!: number;

  @BelongsTo(() => Team, { foreignKey: 'teamJoin' })
  teamJoinRef!: ITeam;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  date!: Date;
}