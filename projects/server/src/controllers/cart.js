const CartModel = require("../model/Cart");
const sequelize = require("sequelize");
const ProductModel = require("../model/Product");
const { StockModel } = require("../model");

module.exports = {
  AddtoCart: async (req, res) => {
    try {
      let { id_product, id_user, total_item } = req.body;
      let data = await CartModel.findOne({
        where: {
          [sequelize.Op.and]: [{ id_product }, { id_user }],
        },
        raw: true,
      });
      if (data) {
        let getStock = await ProductModel.findOne({
          where: {
            id_product,
          },
          attributes: [
            "id_product",
            [sequelize.fn("sum", sequelize.col("stocks.stock")), "stock"],
          ],
          include: [
            {
              model: StockModel,
              as: "stocks",
              attributes: [],
            },
          ],
        });
        let totalNext = data.total_item + req.body.total_item;

        let totalStock = parseInt(getStock.dataValues.stock);
        if (totalNext <= totalStock) {
          let result = await CartModel.increment(
            { total_item: req.body.total_item },
            {
              where: {
                [sequelize.Op.and]: [{ id_product }, { id_user }],
              },
            }
          );
          return res.status(200).send({
            success: true,
            message: "berhasil menambahkan jumlah dikeranjang",
          });
        } else {
          return res.status(500).send({
            success: false,
            message: "sudah maksimal dikeranjang",
          });
        }
      } else {
        try {
          let data = await CartModel.findAll();
          let create = await CartModel.create({
            id_product,
            id_user,
            total_item,
          });
          return res.status(200).send({
            success: true,
            message: "berhasil menambahkan barang ke keranjang",
          });
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getCart: async (req, res) => {
    try {
      const response = await CartModel.findAll({
        where: {
          id_user: req.decript.id_user,
        },
        group: ["id_cart"],

        include: [
          {
            model: ProductModel,
            attributes: [
              "name",
              "product_picture",
              "price",
              [sequelize.fn("sum", sequelize.col("stock")), "stock"],
            ],
            raw: true,
            include: [
              {
                model: StockModel,
                as: "stocks",
                attributes: [],
              },
            ],
          },
        ],
      });

      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  getCartDetail: async (req, res) => {
    try {
      let id_product = req.query.prod;
      let id_user = req.query.id;
      const response = await CartModel.findOne({
        where: {
          [sequelize.Op.and]: [{ id_product }, { id_user }],
        },
      });
      res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  cartIncrement: async (req, res) => {
    try {
      let { id_cart } = req.body;
      let result = await CartModel.increment(
        { total_item: 1 },
        {
          where: { id_cart },
        }
      );
      return res.status(200).send({
        success: true,
        message: "berhasil menambahkan jumlah barang",
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  cartDecrement: async (req, res) => {
    try {
      let { id_cart } = req.body;
      let result = await CartModel.decrement(
        { total_item: 1 },
        {
          where: { id_cart },
        }
      );
      return res.status(200).send({
        success: true,
        message: "berhasil mengurangi jumlah barang",
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  cartDelete: async (req, res) => {
    let id = req.query.id;

    try {
      let id = req.query.id;

      let result = await CartModel.destroy({
        where: { id_cart: id },
      });
      return res.status(200).send({
        success: true,
        message: "berhasil menghapus keranjang",
      });
    } catch (error) {
      return res.status(401).send({
        success: false,
        message: "false",
      });
    }
  },
  cartSelected: async (req, res) => {
    let { id_cart, selected } = req.body;
    try {
      let result = await CartModel.update(
        { selected },
        {
          where: { id_cart },
        }
      );
      return res.status(200).send("success");
    } catch (error) {
      console.log(error);
      return res.status(401).send("unsuccess");
    }
  },
  cartAllSelected: async (req, res) => {
    try {
      let result = await CartModel.update(
        { selected: 1 },
        {
          where: { id_user: req.decript.id_user },
        }
      );
      return res.status(200).send("success");
    } catch (error) {
      console.log(error);
      return res.status(401).send("unsuccess");
    }
  },
  cartAllUnselected: async (req, res) => {
    try {
      let result = await CartModel.update(
        { selected: 0 },
        {
          where: { id_user: req.decript.id_user },
        }
      );
      return res.status(200).send("success");
    } catch (error) {
      console.log(error);
      return res.status(401).send("unsuccess");
    }
  },

  getCartSelected: async (req, res) => {
    let id_user = req.decript.id_user;
    try {
      let result = await CartModel.findAll({
        where: {
          [sequelize.Op.and]: [{ selected: 1 }, { id_user }],
        },
        include: [{ model: ProductModel }],
      });
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  },
};
