import { useEffect, useState } from 'react'
import { supabase } from "./supabaseClient";

// Add "export default" here
export default function useSalesData() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.rpc('get_store_monthly_data')

      if (error) {
        console.error(error)
      } else {
        setData(data)
        console.log("Fetched sales data from supabase:", data) // Debug log
      }
    }

    fetchData()
  }, [])

  return data
}