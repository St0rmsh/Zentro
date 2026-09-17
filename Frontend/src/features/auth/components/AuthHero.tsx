import { motion } from "framer-motion";

export const AuthHero = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 max-w-2xl bg-zinc-950 p-10 xl:p-12 text-white relative overflow-hidden min-h-screen">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-800/20 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[60%] w-[30%] h-[30%] bg-indigo-700/10 rounded-full blur-[100px]" />
      </div>

      {/* Logo / Brand */}
      <div className="z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Zentro</h1>
          <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">
            Publishing Platform
          </p>
        </motion.div>
      </div>

      {/* Main Copy */}
      <div className="z-10 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl xl:text-4xl font-semibold leading-tight mb-6">
            Share your voice with the world.
          </h2>
          <p className="text-zinc-400 text-base xl:text-lg leading-relaxed">
            Join a community of writers and thinkers. Read, write, and deepen your understanding on Zentro.
          </p>
        </motion.div>
        
        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 xl:mt-12 flex gap-8 border-t border-zinc-800 pt-8"
        >
          <div>
            <p className="text-2xl xl:text-3xl font-bold text-white mb-1">2M+</p>
            <p className="text-zinc-500 text-sm">Active Readers</p>
          </div>
          <div>
            <p className="text-2xl xl:text-3xl font-bold text-white mb-1">50k+</p>
            <p className="text-zinc-500 text-sm">Creators</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
