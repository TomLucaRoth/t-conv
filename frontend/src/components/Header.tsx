import logo from "@/assets/placeholder-logo.png"

function Header() {

    return (
        <div className="flex flex-row w-screen h-20 bg-primary items-center">
            <img src={logo} alt="App Logo" className="h-[70%] px-3"/>
            <h1 className="text-primary-foreground font-heading text-[2.5rem] font-bold">TConv</h1>
        </div>
    )
}

export default Header
