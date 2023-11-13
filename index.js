import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;
const database = "./database/db.json";
const data = JSON.parse(fs.readFileSync(database));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// handle error function helper
const handleServerError = (res) => {
  return res.status(500).json({ message: " Internal Server Error" });
};
const handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};

// List of Vehicle Categories
const listCategories = Object.keys(data);

// List of Vehicle Type
const listTypes = Object.assign(
  {},
  ...Object.entries(data).map((val) => {
    return {
      [Object.values(val)[0]]: Object.keys(Object.values(val)[1]),
    };
  })
);

// Validate with JOI
const scheme = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  releaseYear: joi.number().required(),
});
// Validate with JOI
const schemeCategory = joi.object({
  name: joi.string().required(),
});
// Validate with JOI
const schemeType = joi.object({
  name: joi.string().required(),
});

// get all by category
app.get("/all/:category", (req, res) => {
  try {
    const { category } = req.params;
    if (!listCategories.includes(category)) {
      return handleClientError(res, 404, "Category Not Found");
    }
    return res.status(200).json({ data: data[category], message: "success" });
  } catch (error) {
    return handleServerError(res);
  }
});

// get all by type
app.get("/all/:category/:type/", (req, res) => {
  try {
    const { category, type } = req.params;
    if (
      !listCategories.includes(category) ||
      !listTypes[category].includes(type)
    ) {
      return handleClientError(res, 404, "Data Not Found");
    }
    const selectedType = data[category][type];

    return res.status(200).json({ data: selectedType, message: "success" });
  } catch (error) {
    return handleServerError(res);
  }
});

// get by name
app.get("/:category/:type/:name", (req, res) => {
  try {
    const { category, type, name } = req.params;
    console.log(name);
    if (
      !listCategories.includes(category) ||
      !listTypes[category].includes(type) ||
      !data[category][type]?.find(
        (el) => el.name.toLowerCase() !== name.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, "Data Not Found");
    }
    const selectedName = data[category][type]?.filter(
      (el) => el.name.toLowerCase() === name.toLowerCase()
    );
    return res.status(200).json({ data: selectedName[0], message: "success" });
  } catch (error) {
    return handleServerError(res);
  }
});

// get by releaseYear
app.get("/:releaseYear", (req, res) => {
  try {
    const { releaseYear } = req.params;
    console.log(releaseYear);
    const selectedVehicleByYear = [];

    listCategories.forEach((category) => {
      listTypes[category].forEach((type) => {
        data[category][type].forEach((val) => {
          if (parseInt(val.releaseYear) === parseInt(releaseYear)) {
            selectedVehicleByYear.push(val);
          }
        });
      });
    });

    if (selectedVehicleByYear.length === 0) {
      return handleClientError(res, 404, "Data Not Found");
    }
    return res
      .status(200)
      .json({ data: selectedVehicleByYear, message: "success" });
  } catch (error) {
    return handleServerError(res);
  }
});

// add vehicle to db
app.post("/add/:category/:type", (req, res) => {
  try {
    const { category, type } = req.params;
    const newData = req.body;

    const { error } = scheme.validate(newData);

    if (error) {
      res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    if (
      !listCategories.includes(category) ||
      !listTypes[category].includes(type)
    ) {
      return handleClientError(res, 404, "Data category and type not found");
    }

    if (
      data[category][type].find(
        (el) => el.name.toLowerCase() === newData.name.toLowerCase()
      )
    ) {
      return handleClientError(res, 400, "Data With That Name Already Existed");
    }

    data[category][type].push(newData);
    fs.writeFileSync(database, JSON.stringify(data));

    return res.status(201).json({ data: newData, message: "Created" });
  } catch (error) {
    return handleServerError(res);
  }
});

// add category variant to db
app.post("/add-category", (req, res) => {
  try {
    const newCategory = req.body;

    const { error } = schemeCategory.validate(newCategory);

    if (error) {
      res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    if (listCategories.includes(newCategory.name.toLowerCase())) {
      return handleClientError(res, 409, "Category Already Exists");
    }
    data[newCategory.name] = {};

    fs.writeFileSync(database, JSON.stringify(data));

    return res.status(201).json({
      data: data,
      message: "Created new category",
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
});

// add  vehicle type to db
app.post("/add-type/:category", (req, res) => {
  try {
    const { category } = req.params;
    const newType = req.body;

    const { error } = schemeType.validate(newType);

    if (error) {
      res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    if (!listCategories.includes(category.toLowerCase())) {
      return handleClientError(res, 404, "Category Not Found");
    }

    if (listTypes[category].includes(newType.name.toLowerCase())) {
      console.log(listTypes[category]);
      return handleClientError(res, 409, "Data Already Exists");
    }
    data[category] = Object.assign(
      {},
      { ...data[category], [newType.name]: [] }
    );

    fs.writeFileSync(database, JSON.stringify(data));

    return res.status(201).json({
      data: data,
      message: "Created new type",
    });
  } catch (error) {
    return handleServerError(res);
  }
});

// update vehicle
app.put("/update/:category/:type/:name", (req, res) => {
  try {
    const { category, type, name } = req.params;
    const newData = req.body;

    const { error } = scheme.validate(newData);

    if (error) {
      res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }

    if (
      !listCategories.includes(category) ||
      !listTypes[category].includes(type) ||
      !data[category][type].find(
        (el) => el.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, "Data not found");
    }

    const filtered = data[category][type].filter(
      (el) => el.name.toLowerCase() !== name.toLowerCase()
    );
    filtered.push(newData);
    data[category][type] = filtered;

    fs.writeFileSync(database, JSON.stringify(data));

    return res.status(200).json({ data: newData, message: "Updated" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
});

// delete by vehicle name
app.delete("/delete/:category/:type/:name", (req, res) => {
  try {
    const { category, type, name } = req.params;
    if (
      !listCategories.includes(category) ||
      !listTypes[category].includes(type) ||
      !data[category][type].find(
        (el) => el.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, "Data not found");
    }

    data[category][type] = data[category][type].filter(
      (el) => el.name.toLowerCase() !== name.toLowerCase()
    );

    fs.writeFileSync(database, JSON.stringify(data));

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
});

app.listen(PORT, () => {
  console.log(`Listening to Port : ${PORT}`);
});
