import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "Services", timestamps: false })
export default class Service extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  price!: string;
}