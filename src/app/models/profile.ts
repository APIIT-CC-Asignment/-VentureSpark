import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ tableName: "Profiles", timestamps: false })
export default class Profile extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  expertise!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  bio!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rate!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;
}