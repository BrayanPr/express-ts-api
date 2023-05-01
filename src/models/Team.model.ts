import { Table, Model, Column, DataType } from "sequelize-typescript";
import { Team as ITeam } from "../../types";

@Table({
  timestamps: false,
  tableName: 'teams'
})

export default class Team extends Model implements ITeam{
    @Column({
        type: DataType.INTEGER.UNSIGNED,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;
    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    name!:string
    @Column({
        type:DataType.STRING,
        allowNull:true,
    })
    description!:string | null
}