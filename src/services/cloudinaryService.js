const CLOUD_NAME = 'dxto0u375'
const UPLOAD_PRESET = 'foodly_preset'

export const cloudinaryService = {
    async uploadImage(file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
        )

        if (!response.ok) throw new Error('Error al subir la imagen')

        const data = await response.json()
        return data.secure_url
    }
}