export const AddedNotification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="added">
            {message}
        </div>
    )
}

export const ChangedNotification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="changed">
            {message}
        </div>
    )
}

export default AddedNotification; ChangedNotification