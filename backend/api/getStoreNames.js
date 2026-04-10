import { useEffect, useState } from 'react'
import { supabase } from "./supabaseClient";

// Add "export default" here
export default function useSalesData() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.rpc('get_stores')

      if (error) {
        console.error(error)
      } else {
        setData(data)
        console.log("Fetched store names from supabase:", data) // Debug log
      }
    }

    fetchData()
  }, [])

  return data
}