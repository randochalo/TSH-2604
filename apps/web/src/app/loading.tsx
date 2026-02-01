export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <h2 className="text-lg font-medium text-gray-900">Loading...</h2>
        <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  )
}
