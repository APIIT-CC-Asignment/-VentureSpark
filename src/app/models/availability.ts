import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "Availabilities", timestamps: false })
export default class Availability extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  day!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  slots!: string[];
}