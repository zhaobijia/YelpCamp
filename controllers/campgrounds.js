const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.newForm = async (req, res) => {
    res.render('campgrounds/new');
};

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');

    if (!campground) {
        req.flash('error', 'campground cannot be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'campground cannot be found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}

module.exports.createCamp = async (req, res) => {
    //we need express to parse req.body here, otherwise it will be empty
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');//req.flash come after successfully save
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.editCamp = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const moreImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...moreImages);
    await campground.save();
    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted campground.');
    res.redirect('/campgrounds');
};