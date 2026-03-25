interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  location: string
  loading: boolean
  error: string | null
  supported: boolean
}

export function useGeolocation() {
  const state = reactive<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    location: '',
    loading: false,
    error: null,
    supported: false,
  })

  // Check if geolocation is supported
  onMounted(() => {
    state.supported = 'geolocation' in navigator
  })

  // Get current position
  function getCurrentPosition(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!state.supported) {
        state.error = '您的设备不支持地理定位'
        reject(new Error('Geolocation not supported'))
        return
      }

      state.loading = true
      state.error = null

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          state.latitude = position.coords.latitude
          state.longitude = position.coords.longitude
          state.accuracy = position.coords.accuracy

          // Reverse geocoding to get location name
          try {
            const locationName = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            )
            state.location = locationName
          } catch {
            // Fallback to coordinates
            state.location = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }

          state.loading = false
          resolve()
        },
        (error) => {
          state.loading = false
          switch (error.code) {
            case error.PERMISSION_DENIED:
              state.error = '请允许访问位置信息'
              break
            case error.POSITION_UNAVAILABLE:
              state.error = '无法获取位置信息'
              break
            case error.TIMEOUT:
              state.error = '获取位置超时'
              break
            default:
              state.error = '获取位置失败'
          }
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    })
  }

  // Reverse geocoding using OpenStreetMap Nominatim API
  async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'zh-CN',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding failed')
      }

      const data = await response.json()

      // Extract location name from address - 省市区格式
      const address = data.address
      if (address) {
        // 按省市区格式构建位置字符串
        const parts: string[] = []

        // 省
        if (address.province || address.state) {
          parts.push(address.province || address.state)
        }

        // 市
        if (address.city || address.town) {
          parts.push(address.city || address.town)
        }

        // 区/县
        if (address.district || address.county || address.suburb) {
          parts.push(address.district || address.county || address.suburb)
        }

        if (parts.length > 0) {
          return parts.join('')
        }
      }

      return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    } catch {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    }
  }

  return {
    ...toRefs(state),
    getCurrentPosition,
  }
}
