export default function StatCard({ title, amount, color }: { title: string, amount?: number, color: string }) {
    return (
        <div className={'flex flex-col border-1 border-gray-300 rounded-lg p-4 w-full'}>
            <h3 className={'text-nowrap'}>{title}</h3>
            <h2 className={`text-3xl font-semibold ${color}`}>$ {amount || 0}</h2>
        </div>
    )
}