const adminCtrl = {
    index: async(req, res) =>{
        try {
            res.json("message: Admin OK")
        } catch (err) {
            return res.json({msg: err.message})
        }
    },
    showLoginPage: async(req, res) =>{
        try {
            const { user } = req
            if (user) {
                if (user.role < 1) {
                    return res.redirect('back')
                } else {
                    return res.redirect('/admin')
                }
            } else {
                res.render('admin/login')
            }

        } catch (err) {
            return res.json({msg: err.message})
        }
    },
}

module.exports = adminCtrl
