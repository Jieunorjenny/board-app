'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setPosts(data)
    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <Link
          href="/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          새 글 쓰기
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">아직 글이 없어요. 첫 글을 써보세요!</p>
      ) : (
        <ul className="divide-y border rounded">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/post/${post.id}`} className="block p-4 hover:bg-gray-50">
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString('ko-KR')}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
