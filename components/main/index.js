import styles from "./Styles.module.css"
import { GoOctoface } from "react-icons/go"
import { MdSettings } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { BiCoffeeTogo } from "react-icons/bi"

const Nav = () => (
    <nav className={styles.nav}>
        <div className={styles.navButtonsContainer}>
            <button className={styles.buttonIcon}>
                <BsThreeDots />
            </button>
            <button className={styles.buttonIcon}>
                <MdSettings />
            </button>
            <button className={styles.buttonIcon}>
                <GoOctoface />
            </button>
            <button className={styles.buttonIcon}>
                <BiCoffeeTogo />
            </button>
        </div>
    </nav>
)

const NotesSection = () => (
    <>
        <section className={styles.preview}>Preview</section>
        <section className={styles.snippet}>Code Snippet</section>
        <section className={styles.notes}>Notes</section>
    </>
)

const Home = () => {
    return (
        <div className={styles.grid}>
            <Nav />
            <main className={styles.main}>
                <div className={styles.notesLayout}>
                    <NotesSection />
                </div>
            </main>
        </div>
    )
}
export default Home
