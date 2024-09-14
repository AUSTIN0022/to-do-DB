const express = require("express");
const router = express.Router();
const List = require("../models/List");
const { isLoggedIn } = require("../middleware/auth");




// GET /

// GET /lists - Display all lists
router.get("/", async (req, res) => {
    const lists = await List.find({ owner: req.user._id });
    res.render("lists/index", { lists });
}); 

// GET /lists/create - Display create list form
router.get("/create", isLoggedIn, (req, res) => {
    res.render("lists/create");
});


// POST /lists/create - Process list creation
router.post('/create', async (req, res) => {
    try {
        console.log("\n\n"+req.body.list+"\n\n");
        const newList = new List(req.body.list);
        newList.owner = req.user._id;  // Assuming you're using authentication
        await newList.save();
        req.flash('success', 'Successfully created a new list!');
        res.redirect(`/lists/${newList._id}`);
    } catch (e) {
        req.flash('error', 'Error creating list');
        res.redirect('/lists/create');
    }
});

// GET /lists/:id - Display specific list
router.get("/:id",  async (req, res) => {
    const list = await List.findById(req.params.id).populate("todos");
    if (!list) {
        req.flash("error", "Cannot find that list!");
        return res.redirect("/lists");
    }
    res.render("lists/show", { list });
});

// GET /lists/:id/edit - Display edit list form
router.get("/:id/edit",  async (req, res) => {
    const list = await List.findById(req.params.id);
    if (!list) {
        req.flash("error", "Cannot find that list!");
        return res.redirect("/lists");
    }
    res.render("lists/edit", { list });
});

// PUT /lists/:id - Process list update
router.put("/:id",  async (req, res) => {
    const { id } = req.params;
    try {
        const updatedList = await List.findByIdAndUpdate(id, { ...req.body.list }, { new: true });
        // Return updated list as JSON for AJAX
        res.json(updatedList);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update list' });
    }
});

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const lists = await List.find({ user: req.user._id });
        res.render('lists/index', { lists });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


// DELETE /lists/:id - Delete a list
router.delete("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted list");
    res.redirect("/lists");
});

// search List
router.post("/search", isLoggedIn, async (req, res) => {
    const { search } = req.body;  // Use req.body for POST requests
    const userId = req.user._id;
    console.log("\n\n"+req.body+"\n\n");
    console.log("\n\n"+search+"\n\n"+userId+"\n\n");
    let searchData = await List.find({
        $or: [
            { title: new RegExp(search, 'i') },
            { category: new RegExp(search, 'i') } 
        ],
        owner: userId
    }); // Use RegExp for case-insensitive search
    console.log("\n\n"+searchData+"\n\n");
    res.json(searchData);
});

module.exports = router;
