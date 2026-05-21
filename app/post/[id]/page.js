'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function PostDetail() {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) console.error(error)
    else setPost(data)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('정말 삭제할까요?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) alert('삭제 실패: ' + error.message)
    else router.push('/')
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">불러오는 중...</p>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p>글을 찾을 수 없어요.</p>
        <Link href="/" className="text-blue-600">← 목록으로</Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm text-blue-600">← 목록으로</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.created_at).toLocaleString('ko-KR')}
      </p>
      <p className="whitespace-pre-wrap mb-8">{post.content}</p>
      <div className="flex gap-2">
        <Link
          href={`/post/${id}/edit`}
          className="px-4 py-2 rounded border hover:bg-gray-50"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded border border-red-500 text-red-600 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </main>
  )
}
