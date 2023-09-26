export async function downloadFile(idArr: string[], name ='') {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/file/download?idArr[]=${idArr.join('&idArr[]=')}`,
      {
        headers: {
          Authorization: `${window.localStorage.getItem('userToken')}`,
        },
      },
    )
    if (response.status === 200) {
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = name ? name: 'download'
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
