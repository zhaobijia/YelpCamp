const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });


const { cloudinary } = require('../cloudinary')


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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry);
    const newCampground = new Campground(req.body.campground);
    //geodata
    newCampground.geometry = geoData.body.features[0].geometry;
    //add images
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground!');//req.flash come after successfully save
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.editCamp = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //add more images 
    const moreImages = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...moreImages);
    //delete images:
    if (req.body.deleteImages) {
        //delete on cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        //delete on mongodb
        await campground.updateOne({
            $pull: {
                images: {
                    filename: { $in: req.body.deleteImages }
                }
            }
        })
        console.log(campground);
    }
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