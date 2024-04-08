const express = require("express");
const router = express.Router();
const Course = require("../../models/Course");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:courseid", async function (req, res, next) {
  const course = await Course.findCourse(req.params.courseid);
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ msg: "course with that id does not exist" });
  }
});

router.post("/", async function (req, res, next) {
  try {
    await Course.create({
      courseid: req.body.courseid,
      coursename: req.body.coursename,
      semester: req.body.semester,
      coursedesc: req.body.coursedesc,
      enrollnum: req.body.enrollnum,
    });
    res.json({ msg: "course created succesfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
