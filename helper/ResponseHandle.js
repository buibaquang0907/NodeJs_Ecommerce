module.exports = {
    ResponseSend: function (res,success,code,data) {
        res.status(code).json({
            success: success,
            data: data
        });
        
    }
}