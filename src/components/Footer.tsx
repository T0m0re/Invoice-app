
import Container from '@/components/Container'
export default function Footer(){
    return(
        <footer className='mt-8 my-12'>
            <Container>
                <div className='flex justify-between items-center gap-4'>
                    <p className='text-sm'>
                    ZenInvoice &copy; {new Date(). getFullYear()}
                    </p>
                    <p className='text-sm'>
                        Using Nextjs, Xata and Clerk
                    </p>
                </div>
            </Container>
        </footer>
    )
}