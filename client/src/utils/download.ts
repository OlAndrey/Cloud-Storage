export async function downloadFile(idArr: string[]) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/file/download?idArr[]=${idArr.join('&idArr[]=')}`,
      {
        headers: {
          Authorization: `${localStorage.getItem('userToken')}`,
        },
      },
    )
    if (response.status === 200) {
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'download'
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      const data = await response.json()
      alert(data.message)
    }
  } catch (error) {
    console.error(error)
  }
}
