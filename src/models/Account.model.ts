import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Team from "./Team.model";

@Table({
  timestamps: false,
  tableName: "accounts",
})
export default class Account extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  client!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  manager!: string;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  teamId!: number;

  @BelongsTo(() => Team)
  team!: Team;
}
